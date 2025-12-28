export const CustomerNotificationTypeEnum = {
    ORDER_PAID: "ORDER_PAID",
    ORDER_PACKED: "ORDER_PACKED",
    ORDER_PARTIALLY_SHIPPED: "ORDER_PARTIALLY_SHIPPED",
    ORDER_FULLY_SHIPPED: "ORDER_FULLY_SHIPPED",
    ORDER_NEW_COMMENTS: "ORDER_NEW_COMMENTS"
};
class NotificationType {
    constructor(type, msgTemplate) {
        this.type = type;
        this.msgTemplate = msgTemplate;
    }

    formatMessage(replacements) {
        let message = this.msgTemplate;
        for (const [key, value] of Object.entries(replacements)) {

            // console.log(key,value,'console')
            message = message.replace(new RegExp(`#${key}_REPLACE`, 'g'), value);
            message = message.replace(new RegExp(`#${key}`, 'g'), value);
        }
        return message;
    }

    getType() {
        return this.type;
    }

    getMessageTemplate() {
        return this.msgTemplate;
    }

    getRawNotification() {
        return {
            type: this.type,
            msgTemplate: this.msgTemplate
        };
    }
}

export class CustomerNotificationClass {
    static notificationTypes = {
        [CustomerNotificationTypeEnum.ORDER_PAID]: new NotificationType(
            CustomerNotificationTypeEnum.ORDER_PAID,
            "A new order is confirmed: #ORDER_ID_REPLACE is awaiting to be packed and shipped. Click #REPLACE_HERE_URL to view it."
        ),
        [CustomerNotificationTypeEnum.ORDER_PACKED]: new NotificationType(
            CustomerNotificationTypeEnum.ORDER_PACKED,
            "Order #ORDER_ID_REPLACE is now packed and awaiting shipment. Click #REPLACE_HERE_URL to view it."
        ),
        [CustomerNotificationTypeEnum.ORDER_PARTIALLY_SHIPPED]: new NotificationType(
            CustomerNotificationTypeEnum.ORDER_PARTIALLY_SHIPPED,
            "Order #ORDER_ID_REPLACE is partially shipped and on the way. More parts will be shipped soon and awaiting shipment. Click #REPLACE_HERE_URL to view it."
        ),
        [CustomerNotificationTypeEnum.ORDER_FULLY_SHIPPED]: new NotificationType(
            CustomerNotificationTypeEnum.ORDER_FULLY_SHIPPED,
            "Order #ORDER_ID_REPLACE is fully shipped and on the way. Click #REPLACE_HERE_URL to view it."
        ),
        [CustomerNotificationTypeEnum.ORDER_NEW_COMMENTS]: new NotificationType(
            CustomerNotificationTypeEnum.ORDER_NEW_COMMENTS,
            "Order #ORDER_ID_REPLACE has a new message. Click #REPLACE_HERE_URL to view it and respond."
        )
    };

    static getCustomerNotification(type) {
        return this.notificationTypes[type];
    }

    static getRawNotification(type) {
        const notification = this.notificationTypes[type];
        return notification ? notification.getRawNotification() : null;
    }

    static getEnumValue(enumKey) {
        return CustomerNotificationTypeEnum[enumKey];
    }

}

// // Example usage:
// const orderPaidNotification = CustomerNotificationClass.getCustomerNotification(CustomerNotificationClass.getEnumValue('ORDER_PAID'));

// // Get the raw type and message template as an object
// const rawNotification = orderPaidNotification.getRawNotification();

// console.log(rawNotification);
// // Outputs: { type: 'ORDER_PAID', msgTemplate: 'A new order is confirmed: #ORDER_ID_REPLACE is awaiting to be packed and shipped. Click #REPLACE_HERE_URL to view it.' }

// // Format the message with replacements
// const formattedMessage = orderPaidNotification.formatMessage({
//     ORDER_ID: '12345',
//     REPLACE_HERE_URL: 'http://example.com/order/12345'
// });

// console.log(formattedMessage);  // Outputs the formatted message for the ORDER_PAID notification
