import List "mo:core/List";
import EnergyLib "../lib/energy";
import EnergyTypes "../types/energy";

mixin (
  energyLogs : List.List<EnergyLib.EnergyLog>,
  energyState : { var nextLogId : EnergyTypes.LogId },
) {

  /// Record a new energy reading for a property.
  public func addEnergyLog(
    propertyId : EnergyTypes.PropertyId,
    energyType : EnergyTypes.EnergyType,
    kwhValue : Float,
    co2Offset : Float,
  ) : async EnergyLib.EnergyLog {
    EnergyLib.addLog(energyLogs, energyState, propertyId, energyType, kwhValue, co2Offset)
  };

  /// Return energy logs for a property within the last N hours.
  /// Seeds 24h of mock data on first call if none exist (update call, not query).
  public func getEnergyLogs(propertyId : EnergyTypes.PropertyId, hours : Nat) : async [EnergyLib.EnergyLog] {
    EnergyLib.getLogs(energyLogs, energyState, propertyId, hours)
  };
};
