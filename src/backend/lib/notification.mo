import List "mo:core/List";
import Time "mo:core/Time";
import NotifTypes "../types/notification";

module {
  public type Notification = NotifTypes.Notification;
  public type NotificationId = NotifTypes.NotificationId;
  public type UserId = NotifTypes.UserId;

  /// Return all notifications for a given user.
  public func getByUser(
    notifications : List.List<Notification>,
    state : { var nextNotifId : NotificationId },
    userId : UserId,
  ) : [Notification] {
    // Seed 2 sample notifications on first call for this user
    let hasExisting = notifications.any(func(n : Notification) : Bool { n.userId == userId });
    if (not hasExisting) {
      let now = Time.now();
      let warn : Notification = {
        id = state.nextNotifId;
        userId;
        notificationType = #Warning;
        message = "Excessive Consumption detected on your property";
        isRead = false;
        createdAt = now;
      };
      state.nextNotifId += 1;
      let info : Notification = {
        id = state.nextNotifId;
        userId;
        notificationType = #Info;
        message = "System online. Solar monitoring is active.";
        isRead = false;
        createdAt = now;
      };
      state.nextNotifId += 1;
      notifications.add(warn);
      notifications.add(info);
    };
    notifications.filter(func(n : Notification) : Bool { n.userId == userId }).toArray()
  };

  /// Mark a notification as read. Returns false if not found.
  public func markRead(
    notifications : List.List<Notification>,
    notifId : NotificationId,
  ) : Bool {
    var found = false;
    notifications.mapInPlace(func(n : Notification) : Notification {
      if (n.id == notifId) {
        found := true;
        { n with isRead = true }
      } else { n }
    });
    found
  };
};
