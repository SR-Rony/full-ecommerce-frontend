export const socketListenEmitAndOn = {

    //live chat chanel hooks
    init: {
        ping_pong:'ping_pong',
        customer: {
            start_live_chat_init: 'start_live_chat_init',
            start_live_chat_leave: 'start_live_chat_leave'
        },
       
    },
    liveChatCreate: {
        customer: {
            live_chat_customer_chat_created_received: 'live_chat_customer_chat_created_received'
        },
        admin: {
            live_chat_admin_chat_created_received: 'live_chat_admin_chat_created_received'
        }
    },
    liveChatUpdate: {
        customer: {
            live_chat_customer_chat_updated_received: 'live_chat_customer_chat_updated_received'
        },
        admin: {
            live_chat_admin_chat_updated_received: 'live_chat_admin_chat_updated_received'
        }
    },
    liveChatDelete: {
        customer: {
            live_chat_customer_chat_deleted_received: 'live_chat_customer_chat_deleted_received'
        },
        admin: {
            live_chat_admin_chat_deleted_received: 'live_chat_admin_chat_deleted_received'
        }
    },

    //message hooks
    liveChatMessageRead: {
        customer: {
            live_chat_customer_message_read_received: 'live_chat_customer_message_read_received'
        },
        admin: {
            live_chat_admin_message_read_received: 'live_chat_admin_message_read_received'
        },
    },
    liveChatMessageCreate: {
        customer: {
            live_chat_customer_message_created_received: 'live_chat_customer_message_created_received'
        },
        admin: {
            live_chat_admin_message_created_received: 'live_chat_admin_message_created_received'
        }
    },
    liveChatMessageUpdate: {
        customer: {
            live_chat_customer_message_updated_received: 'live_chat_customer_message_updated_received'
        },
        admin: {
            live_chat_admin_message_updated_received: 'live_chat_admin_message_updated_received'
        }
    },
    liveChatMessageDelete: {
        customer: {
            live_chat_customer_message_deleted_received: 'live_chat_customer_message_deleted_received'
        },
        admin: {
            live_chat_admin_message_deleted_received: 'live_chat_admin_message_deleted_received'
        }
    },
};
