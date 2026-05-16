import CommonTypes "common";

module {
  public type NotificationId = CommonTypes.NotificationId;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type NotificationType = { #Warning; #Info };

  public type Notification = {
    id : NotificationId;
    userId : UserId;
    notificationType : NotificationType;
    message : Text;
    isRead : Bool;
    createdAt : Timestamp;
  };
};
