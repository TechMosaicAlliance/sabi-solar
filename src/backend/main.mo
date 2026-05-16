import List "mo:core/List";
import UserLib "lib/user";
import PropertyLib "lib/property";
import EnergyLib "lib/energy";
import NotifLib "lib/notification";
import UserTypes "types/user";
import PropertyTypes "types/property";
import EnergyTypes "types/energy";
import NotifTypes "types/notification";
import UserApiMixin "mixins/user-api";
import PropertyApiMixin "mixins/property-api";
import EnergyApiMixin "mixins/energy-api";
import NotifApiMixin "mixins/notification-api";

actor {
  // --- Stable state ---
  let users = List.empty<UserLib.User>();
  let userState = { var nextUserId : UserTypes.UserId = 0 };

  let properties = List.empty<PropertyLib.Property>();
  let propertyState = { var nextPropertyId : PropertyTypes.PropertyId = 0 };

  let energyLogs = List.empty<EnergyLib.EnergyLog>();
  let energyState = { var nextLogId : EnergyTypes.LogId = 0 };

  let notifications = List.empty<NotifLib.Notification>();
  let notifState = { var nextNotifId : NotifTypes.NotificationId = 0 };

  // --- Mixins ---
  include UserApiMixin(users, userState);
  include PropertyApiMixin(properties, propertyState);
  include EnergyApiMixin(energyLogs, energyState);
  include NotifApiMixin(notifications, notifState);
};
