const handleOpenMaps = () => {
const address = `${order.address.address}, ${order.address.locality}, ${order.address.city}, ${order.address.pinCode}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
window.open(mapsUrl, '\_blank');
};

        window.open(`tel:${order.address.phoneNumber}`, '_self');
