import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;

  public type User = {
    id : UserId;
    name : Text;
    email : Text;
    phone : Text;
    hashedPassword : Text;
  };

  // Shared-safe result types for API boundary
  public type AuthResult = {
    #ok : UserPublic;
    #err : Text;
  };

  public type UserPublic = {
    id : UserId;
    name : Text;
    email : Text;
    phone : Text;
  };
};
