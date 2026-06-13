# DJHan Warehouse Container Manager

Interactive warehouse yard prototype for tracking storage container status.

## Files

- `outputs/warehouse-container-manager.html` - the interactive browser prototype.
- `outputs/warehouse.png` - the warehouse layout image used as the base map.

## Features

- Containers default to available.
- Status colours: green for available, amber for rented, red for bad debt.
- Click a container to edit customer details, notes, status, and container size.
- Hovering only changes the fill colour inside the existing container outline.
- Data is saved locally in the browser with `localStorage`.
