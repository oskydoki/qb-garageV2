let currentTransferVehicle = null;
let translations = {
    transfer: {
        title: 'Transfer Vehicle',
        subtitle: 'Transfer vehicle ownership to another player',
        player_id_label: 'Player ID',
        player_id_placeholder: '</div>Enter player ID',
        fee_text: 'A 2% transfer fee will be charged',
        btn_cancel: 'Cancel',
        btn_transfer: 'Transfer',
        price_label: 'Price'
    }
};

window.addEventListener("message", function (event) {
    const data = event.data;
    if (data.action === "VehicleList") {
        const garageLabel = data.garageLabel;
        const vehicles = data.vehicles;
        const locale = data.translations;
        
        // Update translations if provided
        if (locale) {
            translations = locale;
        }
        
        populateVehicleList(garageLabel, vehicles);
        displayUI();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeGarageMenu();
    }
});

function closeGarageMenu() {
    const container = document.getElementById("garage-container");
    container.classList.remove("visible");
    container.classList.add("hiding");

    setTimeout(() => {
        container.style.display = "none";
        container.classList.remove("hiding");
        hideTransferModal();
    }, 300);

    fetch("https://qb-garages/closeGarage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({}),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data === "ok") {
                return;
            } else {
                console.error("Failed to close Garage UI");
            }
        });
}

function displayUI() {
    const container = document.getElementById("garage-container");
    container.style.display = "block";
    setTimeout(() => {
        container.classList.add("visible");
    }, 50);
}

function populateVehicleList(garageLabel, vehicles) {
    const container = document.getElementById("vehicle-container");
    const header = document.getElementById("garage-header");
    
    header.textContent = garageLabel;
    container.innerHTML = '';

    if (!vehicles || vehicles.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `
            <i class="fas fa-car"></i>
            <h3>No vehicles found</h3>
            <p>This garage is currently empty</p>
        `;
        container.appendChild(emptyState);
        return;
    }

    vehicles.forEach((vehicle, index) => {
        const item = document.createElement("div");
        item.className = "vehicle-item";
        
        // Determine status and icon
        let status, statusClass, iconClass;
        let isDepotPrice = false;
        
        if (vehicle.state === 0) {
            if (vehicle.depotPrice && vehicle.depotPrice > 0) {
                isDepotPrice = true;
                if (vehicle.type === "public") {
                    status = "Depot";
                    statusClass = "status-depot";
                } else if (vehicle.type === "depot") {
                    status = `$${vehicle.depotPrice.toFixed(0)}`;
                    statusClass = "status-depot";
                } else {
                    status = "Available";
                    statusClass = "status-available";
                }
            } else {
                status = "Out";
                statusClass = "status-out";
            }
            iconClass = "fas fa-car";
        } else if (vehicle.state === 1) {
            if (vehicle.depotPrice && vehicle.depotPrice > 0 && vehicle.type === "depot") {
                status = `$${vehicle.depotPrice.toFixed(0)}`;
                statusClass = "status-depot";
                isDepotPrice = true;
            } else {
                status = "Available";
                statusClass = "status-available";
            }
            iconClass = "fas fa-car";
        } else {
            status = "Impound";
            statusClass = "status-impound";
            iconClass = "fas fa-exclamation-triangle";
        }

        // Use the real vehicle price from server
        const vehiclePrice = vehicle.price || 0;
        
        // Get fuel, engine, body percentages
        const fuelPercent = Math.round(vehicle.fuel || 0);
        const enginePercent = Math.round((vehicle.engine || 0) / 10);
        const bodyPercent = Math.round((vehicle.body || 0) / 10);
        const distanceKm = Math.round((vehicle.distance || 0) * 1.6); // Convert miles to km

        // Determine color classes for stats
        const getFuelClass = (fuel) => fuel >= 50 ? 'good' : fuel >= 25 ? 'medium' : 'bad';
        const getEngineClass = (engine) => engine >= 70 ? 'good' : engine >= 40 ? 'medium' : 'bad';
        const getBodyClass = (body) => body >= 70 ? 'good' : body >= 40 ? 'medium' : 'bad';

        item.innerHTML = `
            <div class="vehicle-main">
            <div class="vehicle-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="vehicle-info">
                <div class="vehicle-name">${vehicle.vehicleLabel || 'Unknown Vehicle'}</div>
                <div class="vehicle-plate">${vehicle.plate || 'NO PLATE'}</div>
            </div>
            <div class="vehicle-status ${statusClass}">${status}</div>
            <i class="fas fa-chevron-down expand-arrow"></i>
            </div>
            <div class="vehicle-details">
            <div class="details-content">
                <div class="vehicle-stats">
                <div class="stat-item">
                    <div class="stat-header">
                    <span class="stat-label">Fuel</span>
                    <span class="stat-value ${getFuelClass(fuelPercent)}">${fuelPercent}%</span>
                    </div>
                    <div class="stat-bar">
                    <div class="stat-fill stat-fuel" style="width: ${fuelPercent}%"></div>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-header">
                    <span class="stat-label">Engine</span>
                    <span class="stat-value ${getEngineClass(enginePercent)}">${enginePercent}%</span>
                    </div>
                    <div class="stat-bar">
                    <div class="stat-fill stat-engine" style="width: ${enginePercent}%"></div>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-header">
                    <span class="stat-label">Body</span>
                    <span class="stat-value ${getBodyClass(bodyPercent)}">${bodyPercent}%</span>
                    </div>
                    <div class="stat-bar">
                    <div class="stat-fill stat-body" style="width: ${bodyPercent}%"></div>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="stat-header">
                    <span class="stat-label">Mileage</span>
                    <span class="stat-value">${distanceKm.toLocaleString()} km</span>
                    </div>
                    <div class="stat-bar">
                    <div class="stat-fill" style="width: 0%; background-color: var(--border-color);"></div>
                    </div>
                </div>
                </div>
                <div class="vehicle-price-container">
                <span class="price-label">${translations.transfer?.price_label || 'Price'}</span>
                <span class="price-value">$${vehiclePrice.toLocaleString()}</span>
                </div>
                <div class="actions">
                ${getActionButtons(vehicle, status, isDepotPrice, vehiclePrice)}
                </div>
            </div>
            </div>
        `;

        // Click handler for expanding
        item.querySelector('.vehicle-main').addEventListener('click', function() {
            item.classList.toggle('expanded');
        });

        container.appendChild(item);
    });
}

function getActionButtons(vehicle, status, isDepotPrice, vehiclePrice) {
    const vehicleData = {
        vehicle: vehicle.vehicle,
        garage: vehicle.garage,
        index: vehicle.index,
        plate: vehicle.plate,
        type: vehicle.type,
        depotPrice: vehicle.depotPrice,
        vehicleLabel: vehicle.vehicleLabel,
        price: vehiclePrice,
        stats: {
            fuel: vehicle.fuel,
            engine: vehicle.engine,
            body: vehicle.body,
        },
    };

    const transferButtonText = translations.transfer?.btn_transfer || 'Transferir';

    if (status === "Out") {
        return `
            <button class="btn btn-track" onclick="trackVehicle('${vehicle.plate}')">Track</button>
            <button class="btn btn-transfer" onclick="showTransferModal(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">${transferButtonText}</button>
        `;
    } else if (status === "Impound") {
        return `
            <button class="btn btn-disabled" disabled>Impound</button>
            <button class="btn btn-transfer" onclick="showTransferModal(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">${transferButtonText}</button>
        `;
    } else if (status === "Depot" && !isDepotPrice) {
        return `
            <button class="btn btn-disabled" disabled>Depot</button>
            <button class="btn btn-transfer" onclick="showTransferModal(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">${transferButtonText}</button>
        `;
    } else if (isDepotPrice && vehicle.type === "depot") {
        return `
            <button class="btn btn-depot" onclick="takeOutDepot(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">Pay ${status}</button>
            <button class="btn btn-transfer" onclick="showTransferModal(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">${transferButtonText}</button>
        `;
    } else {
        return `
            <button class="btn btn-drive" onclick="takeOutVehicle(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">Use</button>
            <button class="btn btn-transfer" onclick="showTransferModal(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">${transferButtonText}</button>
        `;
    }
}

function showTransferModal(vehicleData) {
    currentTransferVehicle = vehicleData;
    
    // Hide main view and show transfer modal
    document.getElementById("main-view").style.display = "none";
    document.getElementById("transfer-modal").classList.add("visible");
    
    // Update transfer modal content with translations
    document.getElementById("transfer-title").textContent = translations.transfer?.title || 'Transfer Vehicle';
    document.getElementById("transfer-subtitle").textContent = translations.transfer?.subtitle || 'Transfer vehicle ownership to another player';
    document.getElementById("player-id-label").textContent = translations.transfer?.player_id_label || 'Player ID';
    document.getElementById("player-id").placeholder = translations.transfer?.player_id_placeholder || 'Enter player ID';
    document.getElementById("fee-text").textContent = translations.transfer?.fee_text || 'A 2% transfer fee will be charged';
    document.getElementById("btn-back").textContent = translations.transfer?.btn_cancel || 'Cancel';
    document.getElementById("btn-confirm-transfer").textContent = translations.transfer?.btn_transfer || 'Transfer';
    
    // Update vehicle info
    document.getElementById("transfer-vehicle-name").textContent = vehicleData.vehicleLabel || 'Unknown Vehicle';
    document.getElementById("transfer-vehicle-plate").textContent = vehicleData.plate || 'NO PLATE';
    
    // Calculate and display transfer fee (2% of real vehicle price)
    const transferFee = Math.round(vehicleData.price * 0.02);
    document.getElementById("transfer-fee").textContent = `$${transferFee.toLocaleString()}`;
    
    // Reset form
    document.getElementById("player-id").value = "";
    document.getElementById("btn-confirm-transfer").disabled = true;
}

function hideTransferModal() {
    document.getElementById("transfer-modal").classList.remove("visible");
    document.getElementById("main-view").style.display = "block";
    currentTransferVehicle = null;
}

// Transfer modal event listeners
document.getElementById("btn-back").addEventListener("click", hideTransferModal);

document.getElementById("player-id").addEventListener("input", function() {
    const playerId = this.value.trim();
    const confirmBtn = document.getElementById("btn-confirm-transfer");
    
    if (playerId && parseInt(playerId) > 0) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
});

document.getElementById("btn-confirm-transfer").addEventListener("click", function() {
    if (!currentTransferVehicle) return;
    
    const playerId = document.getElementById("player-id").value.trim();
    if (!playerId || parseInt(playerId) <= 0) return;
    
    const transferData = {
        vehicle: currentTransferVehicle,
        targetPlayerId: parseInt(playerId),
        transferFee: Math.round(currentTransferVehicle.price * 0.02)
    };
    
    fetch("https://qb-garages/transferVehicle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(transferData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data === "ok") {
                closeGarageMenu();
            } else {
                console.error("Failed to transfer vehicle.");
            }
        });
});

function trackVehicle(plate) {
    fetch("https://qb-garages/trackVehicle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(plate),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data === "ok") {
                closeGarageMenu();
            }
        });
}

function takeOutDepot(vehicleData) {
    fetch("https://qb-garages/takeOutDepo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(vehicleData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data === "ok") {
                closeGarageMenu();
            } else {
                console.error("Failed to pay depot price.");
            }
        });
}

function takeOutVehicle(vehicleData) {
    fetch("https://qb-garages/takeOutVehicle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(vehicleData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data === "ok") {
                closeGarageMenu();
            } else {
                console.error("Failed to close Garage UI.");
            }
        });
}
