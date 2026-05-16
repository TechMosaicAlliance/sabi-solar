import List "mo:core/List";
import PropertyTypes "../types/property";

module {
  public type Property = PropertyTypes.Property;
  public type PropertyId = PropertyTypes.PropertyId;
  public type UserId = PropertyTypes.UserId;

  /// Create a new property record and append to the list.
  public func create(
    properties : List.List<Property>,
    state : { var nextPropertyId : PropertyId },
    userId : UserId,
    title : Text,
    address : Text,
    meterNumber : Text,
    capacityKva : Float,
    modelNumber : Text,
  ) : Property {
    let id = state.nextPropertyId;
    state.nextPropertyId += 1;
    let prop : Property = {
      id;
      userId;
      title;
      address;
      meterNumber;
      capacityKva;
      modelNumber;
      status = #Online;
    };
    properties.add(prop);
    prop
  };

  /// Return all properties belonging to a given user.
  public func getByUser(
    properties : List.List<Property>,
    userId : UserId,
  ) : [Property] {
    properties.filter(func(p : Property) : Bool { p.userId == userId }).toArray()
  };
};
