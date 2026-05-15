import Map "mo:core/Map";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import FileStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProjectId = Nat;
  type SubmissionId = Nat;
  type PositiveFloat = Float;

  type ProjectStatus = {
    #pending;
    #inProgress;
    #verified;
    #rejected;
  };

  type SubmissionStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type Project = {
    id : Nat;
    ownerName : Text;
    country : Text;
    projectType : Text;
    landAreaHectares : PositiveFloat;
    gpsCoordinates : Text;
    startDate : Text;
    endDate : Text;
    creditsRequired : Nat;
    creditsPurchased : Nat;
    status : ProjectStatus;
    createdAt : Int;
  };

  public type RestorationSubmission = {
    id : Nat;
    projectId : Nat;
    description : Text;
    completionDate : Text;
    files : [FileStorage.ExternalBlob];
    status : SubmissionStatus;
    submittedAt : Int;
    reviewerNote : Text;
  };

  public type GlobalStats = {
    totalCreditsIssued : Nat;
    totalLandRestored : PositiveFloat;
    countriesActive : Nat;
    projectsVerified : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module Project {
    public func compare(p1 : Project, p2 : Project) : Order.Order {
      Int.compare(p1.createdAt, p2.createdAt);
    };
  };

  module RestorationSubmission {
    public func compare(s1 : RestorationSubmission, s2 : RestorationSubmission) : Order.Order {
      Int.compare(s1.submittedAt, s2.submittedAt);
    };
  };

  // --- State ---

  stable var nextProjectId : ProjectId = 1;
  stable var nextSubmissionId : SubmissionId = 1;
  stable let projects = Map.empty<ProjectId, Project>();
  stable let restorationSubmissions = Map.empty<SubmissionId, RestorationSubmission>();
  stable let userProfiles = Map.empty<Principal, UserProfile>();

  stable var totalCreditsIssuedCached : Nat = 0;
  stable var totalLandRestoredCached : PositiveFloat = 0.0;
  stable var countriesActiveCached : Nat = 0;
  stable var projectsVerifiedCached : Nat = 0;

  // --- Helper Functions ---

  func getCurrentTime() : Int {
    Time.now() / 1_000_000;
  };

  func updateCountriesActive() {
    let countrySet = Map.empty<Text, Bool>();
    for (project in projects.values()) {
      countrySet.add(project.country, true);
    };
    countriesActiveCached := countrySet.size();
  };

  // --- User Profile Management ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profiles");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Project Management ---

  public shared ({ caller }) func submitProject(
    ownerName : Text,
    country : Text,
    projectType : Text,
    landAreaHectares : PositiveFloat,
    gpsCoordinates : Text,
    startDate : Text,
    endDate : Text,
  ) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User role required");
    };

    if (landAreaHectares <= 0.0) {
      Runtime.trap("Land area must be positive");
    };

    let id = nextProjectId;
    let creditsRequired = (landAreaHectares * 100.0).toInt().toNat();

    let project : Project = {
      id;
      ownerName;
      country;
      projectType;
      landAreaHectares;
      gpsCoordinates;
      startDate;
      endDate;
      creditsRequired;
      creditsPurchased = 0;
      status = #pending;
      createdAt = getCurrentTime();
    };

    projects.add(id, project);

    updateCountriesActive();

    nextProjectId += 1;
    id;
  };

  public shared ({ caller }) func purchaseCredits(projectId : ProjectId, amount : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User role required");
    };

    switch (projects.get(projectId)) {
      case (null) { false };
      case (?project) {
        if (amount == 0 or project.creditsPurchased + amount > project.creditsRequired) {
          return false;
        };
        let updatedProject = {
          project with
          creditsPurchased = project.creditsPurchased + amount;
        };
        projects.add(projectId, updatedProject);
        totalCreditsIssuedCached += amount;
        true;
      };
    };
  };

  public shared ({ caller }) func updateProjectStatus(id : ProjectId, status : ProjectStatus) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    switch (projects.get(id)) {
      case (null) { false };
      case (?project) {
        let oldStatus = project.status;
        let updatedProject = { project with status };
        projects.add(id, updatedProject);

        if (oldStatus != #verified and status == #verified) {
          projectsVerifiedCached += 1;
        } else if (oldStatus == #verified and status != #verified) {
          if (projectsVerifiedCached > 0) {
            projectsVerifiedCached -= 1;
          };
        };

        true;
      };
    };
  };

  public query ({ caller }) func getProjects() : async [Project] {
    projects.values().toArray().sort();
  };

  public query ({ caller }) func getProject(id : ProjectId) : async ?Project {
    projects.get(id);
  };

  public query ({ caller }) func getGreenMap() : async [Project] {
    projects.values().toArray().filter(
      func(p) {
        p.status == #verified;
      }
    ).sort();
  };

  // --- Global Stats ---

  public query ({ caller }) func getGlobalStats() : async GlobalStats {
    {
      totalCreditsIssued = totalCreditsIssuedCached;
      totalLandRestored = totalLandRestoredCached;
      countriesActive = countriesActiveCached;
      projectsVerified = projectsVerifiedCached
    };
  };

  // --- Restoration Submissions ---

  public shared ({ caller }) func submitRestoration(
    projectId : ProjectId,
    description : Text,
    completionDate : Text,
    files : [FileStorage.ExternalBlob],
  ) : async SubmissionId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User role required");
    };

    let id = nextSubmissionId;

    let submission : RestorationSubmission = {
      id;
      projectId;
      description;
      completionDate;
      files;
      status = #pending;
      submittedAt = getCurrentTime();
      reviewerNote = "";
    };

    restorationSubmissions.add(id, submission);
    nextSubmissionId += 1;
    id;
  };

  public shared ({ caller }) func approveRestoration(id : SubmissionId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    switch (restorationSubmissions.get(id)) {
      case (null) { false };
      case (?submission) {
        let updatedSubmission = { submission with status = #approved };
        restorationSubmissions.add(id, updatedSubmission);

        switch (projects.get(submission.projectId)) {
          case (null) { false };
          case (?project) {
            let oldStatus = project.status;
            let updatedProject = { project with status = #verified };
            projects.add(project.id, updatedProject);
            
            totalLandRestoredCached += project.landAreaHectares;
            
            if (oldStatus != #verified) {
              projectsVerifiedCached += 1;
            };
            
            true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectRestoration(id : SubmissionId, note : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };

    switch (restorationSubmissions.get(id)) {
      case (null) { false };
      case (?submission) {
        let updatedSubmission = {
          submission with
          status = #rejected;
          reviewerNote = note;
        };
        restorationSubmissions.add(id, updatedSubmission);
        true;
      };
    };
  };

  public query ({ caller }) func getRestorationSubmissions() : async [RestorationSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User role required");
    };
    restorationSubmissions.values().toArray().sort();
  };

  public query ({ caller }) func getAdminSubmissions() : async [RestorationSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin role required");
    };
    restorationSubmissions.values().toArray().sort();
  };
};
