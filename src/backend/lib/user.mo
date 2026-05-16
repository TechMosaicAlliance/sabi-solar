import List "mo:core/List";
import UserTypes "../types/user";

module {
  public type User = UserTypes.User;
  public type UserPublic = UserTypes.UserPublic;
  public type UserId = UserTypes.UserId;
  public type AuthResult = UserTypes.AuthResult;

  /// Attempt to authenticate a user by email and hashed password.
  /// Returns user public info on success or an error message.
  public func authenticate(
    users : List.List<User>,
    email : Text,
    hashedPassword : Text,
  ) : AuthResult {
    switch (users.find(func(u : User) : Bool { u.email == email })) {
      case null { #err "Invalid email or password" };
      case (?u) {
        if (u.hashedPassword == hashedPassword) {
          #ok(toPublic(u))
        } else {
          #err "Invalid email or password"
        }
      };
    }
  };

  /// Register a new user. Returns the new user's public info or an error.
  public func register(
    users : List.List<User>,
    state : { var nextUserId : UserId },
    name : Text,
    email : Text,
    phone : Text,
    hashedPassword : Text,
  ) : AuthResult {
    switch (users.find(func(u : User) : Bool { u.email == email })) {
      case (?_) { #err "Email already registered" };
      case null {
        let id = state.nextUserId;
        state.nextUserId += 1;
        let user : User = { id; name; email; phone; hashedPassword };
        users.add(user);
        #ok(toPublic(user))
      };
    }
  };

  /// Convert internal User to shareable UserPublic.
  public func toPublic(user : User) : UserPublic {
    { id = user.id; name = user.name; email = user.email; phone = user.phone }
  };
};
