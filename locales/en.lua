local Translations = {
    error = {
        no_vehicles = 'There are no vehicles in this location!',
        not_depot = 'Your vehicle is not in depot',
        not_owned = 'This vehicle can\'t be stored',
        not_correct_type = 'You can\'t store this type of vehicle here',
        not_enough = 'Not enough money',
        no_garage = 'None',
        vehicle_occupied = 'You can\'t store this vehicle as it is not empty',
        vehicle_not_tracked = 'Could not track vehicle',
        no_spawn = 'Area too crowded',
        player_offline = 'Player is not online',
        not_vehicle_owner = 'You are not the owner of this vehicle',
        insufficient_funds = 'You don\'t have enough money for the transfer fee'
    },
    success = {
        vehicle_parked = 'Vehicle Stored',
        vehicle_tracked = 'Vehicle Tracked',
        vehicle_transferred = 'Vehicle transferred to %s %s for $%s',
        vehicle_received = 'You have received a vehicle (%s) from %s %s'
    },
    status = {
        out = 'Out',
        garaged = 'Garaged',
        impound = 'Impounded By Police',
        house = 'House',
    },
    info = {
        car_e = 'E - Garage',
        sea_e = 'E - Boathouse',
        air_e = 'E - Hangar',
        rig_e = 'E - Rig Lot',
        depot_e = 'E - Depot',
        house_garage = 'E - House Garage',
    },
    transfer = {
        title = 'Transfer Vehicle',
        subtitle = 'Transfer vehicle ownership to another player',
        player_id_label = 'Player ID',
        player_id_placeholder = 'Enter player ID',
        fee_text = 'A 2% transfer fee will be charged',
        btn_cancel = 'Cancel',
        btn_transfer = 'Transfer',
        price_label = 'Price'
    }
}

Lang = Lang or Locale:new({
    phrases = Translations,
    warnOnMissing = true
})