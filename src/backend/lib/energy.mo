import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import EnergyTypes "../types/energy";
import Int "mo:core/Int";

module {
  public type EnergyLog = EnergyTypes.EnergyLog;
  public type LogId = EnergyTypes.LogId;
  public type PropertyId = EnergyTypes.PropertyId;
  public type EnergyType = EnergyTypes.EnergyType;

  /// Add a new energy log entry.
  public func addLog(
    logs : List.List<EnergyLog>,
    state : { var nextLogId : LogId },
    propertyId : PropertyId,
    energyType : EnergyType,
    kwhValue : Float,
    co2Offset : Float,
  ) : EnergyLog {
    let id = state.nextLogId;
    state.nextLogId += 1;
    let entry : EnergyLog = {
      id;
      propertyId;
      energyType;
      kwhValue;
      co2Offset;
      timestamp = Time.now();
    };
    logs.add(entry);
    entry
  };

  /// Seed 24 hourly mock logs for a property if none exist, then return
  /// all logs for that property within the last `hours` hours.
  public func getLogs(
    logs : List.List<EnergyLog>,
    state : { var nextLogId : LogId },
    propertyId : PropertyId,
    hours : Nat,
  ) : [EnergyLog] {
    let hasExisting = logs.find(func(l : EnergyLog) : Bool { l.propertyId == propertyId }) != null;
    if (not hasExisting) {
      let now = Time.now();
      let hourNs : Int = 3_600_000_000_000;
      let kwhValues : [Float] = [1.2, 2.5, 0.8, 3.1, 4.2, 1.7, 0.5, 2.9, 3.8, 1.1,
                                  2.3, 4.5, 0.7, 3.6, 2.1, 1.5, 4.9, 0.9, 2.7, 3.3,
                                  1.8, 4.1, 0.6, 2.4];
      var i : Nat = 0;
      while (i < 24) {
        let kwh = kwhValues[i];
        let co2 = kwh * 0.233;
        let energyType : EnergyType = if (i % 2 == 0) { #Solar } else { #Grid };
        let id = state.nextLogId;
        state.nextLogId += 1;
        let offset : Int = if (i > 23) 0 else Int.fromNat(23 - i);
        let ts : Int = now - (offset * hourNs);
        let entry : EnergyLog = {
          id;
          propertyId;
          energyType;
          kwhValue = kwh;
          co2Offset = co2;
          timestamp = ts;
        };
        logs.add(entry);
        i += 1;
      }
    };
    let cutoff : Int = Time.now() - (hours.toInt() * 3_600_000_000_000);
    logs.filter(func(l : EnergyLog) : Bool {
      l.propertyId == propertyId and l.timestamp >= cutoff
    }).toArray()
  };
};
