export const server = import.meta.env.VITE_BACKEND_URL;


export const API_PATHS = {
    USER: {
        LOGIN: '/users/login',
        SIGNUP: '/users/signup',
    },
    EVENTS: {
        GET: '/events',
        CREATE:'/events',
        UPDATE:(id)=>`/events/${id}`
    
    },
    SLOT:{
        GETSWAPSLOT:'/swappable-slots',
        SWAP_REQ:'/swap-request',
        GET_SWAP_REQ:'/swap-requests',
        SWAP_RES:(requestId)=>`/swap-response/${requestId}`
    }
}