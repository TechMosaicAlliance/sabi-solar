import CommonTypes "common";

module {
  public type LogId = CommonTypes.LogId;
  public type PropertyId = CommonTypes.PropertyId;
  public type Timestamp = CommonTypes.Timestamp;

  public type EnergyType = { #Solar; #Grid };

  public type EnergyLog = {
    id : LogId;
    propertyId : PropertyId;
    energyType : EnergyType;
    kwhValue : Float;
    co2Offset : Float;
    timestamp : Timestamp;
  };
};
