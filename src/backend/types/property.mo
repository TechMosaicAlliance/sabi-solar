import CommonTypes "common";

module {
  public type PropertyId = CommonTypes.PropertyId;
  public type UserId = CommonTypes.UserId;

  public type PropertyStatus = { #Online; #Offline };

  public type Property = {
    id : PropertyId;
    userId : UserId;
    title : Text;
    address : Text;
    meterNumber : Text;
    capacityKva : Float;
    modelNumber : Text;
    status : PropertyStatus;
  };
};
