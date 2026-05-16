import List "mo:core/List";
import NotifLib "../lib/notification";
import NotifTypes "../types/notification";

mixin (
  notifications : List.List<NotifLib.Notification>,
  notifState : { var nextNotifId : NotifTypes.NotificationId },
) {

  /// Return all notifications for a user. Seeds 2 sample notifications on first call.
  public func getNotifications(userId : NotifTypes.UserId) : async [NotifLib.Notification] {
    NotifLib.getByUser(notifications, notifState, userId)
  };

  /// Mark a specific notification as read.
  public func markNotificationRead(notifId : NotifTypes.NotificationId) : async Bool {
    NotifLib.markRead(notifications, notifId)
  };
};
