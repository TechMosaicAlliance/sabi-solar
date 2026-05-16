import List "mo:core/List";
import UserLib "../lib/user";
import UserTypes "../types/user";

mixin (
  users : List.List<UserLib.User>,
  userState : { var nextUserId : UserTypes.UserId },
) {

  /// Authenticate a user by email and password (client must hash password before calling).
  public func authenticate(email : Text, hashedPassword : Text) : async UserLib.AuthResult {
    UserLib.authenticate(users, email, hashedPassword)
  };

  /// Register a new user account.
  public func registerUser(
    name : Text,
    email : Text,
    phone : Text,
    hashedPassword : Text,
  ) : async UserLib.AuthResult {
    UserLib.register(users, userState, name, email, phone, hashedPassword)
  };
};
