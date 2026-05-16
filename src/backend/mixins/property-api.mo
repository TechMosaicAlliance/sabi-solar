import List "mo:core/List";
import PropertyLib "../lib/property";
import PropertyTypes "../types/property";

mixin (
  properties : List.List<PropertyLib.Property>,
  propertyState : { var nextPropertyId : PropertyTypes.PropertyId },
) {

  /// Create and persist a new property.
  public func createProperty(
    userId : PropertyTypes.UserId,
    title : Text,
    address : Text,
    meterNumber : Text,
    capacityKva : Float,
    modelNumber : Text,
  ) : async PropertyLib.Property {
    PropertyLib.create(properties, propertyState, userId, title, address, meterNumber, capacityKva, modelNumber)
  };

  /// Get all properties belonging to a user.
  public query func getProperties(userId : PropertyTypes.UserId) : async [PropertyLib.Property] {
    PropertyLib.getByUser(properties, userId)
  };
};
