import logo from './logo.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.png'
import upload_area from './upload_area.png'
import parcel_icon from './parcel_icon.png'

export const assets ={
    logo,
    add_icon,
    order_icon,
    profile_image,
    upload_area,
    parcel_icon
}

// Dynamic URL configuration - uses production URL in production, localhost in development
const getBaseUrl = () => {
    if (import.meta.env.PROD) {
        return import.meta.env.VITE_API_URL || "http://localhost:4000";
    }
    return import.meta.env.VITE_LOCAL_API_URL || "http://localhost:4000";
};

export const url = getBaseUrl();