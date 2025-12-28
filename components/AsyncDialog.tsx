import React from 'react';
import ReactDOM from 'react-dom';

export const showAsyncDialog = async (Component:any,data:any,controller:any) => {
    return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        container.classList.add("popup-bundle");
        document.body.appendChild(container);

        const onClose = (result:any) => {
            //ReactDOM.unmountComponentAtNode(container);
            const docs = [...document.getElementsByClassName("popup-bundle")]
            for(let doc of docs) {
                document.body.removeChild(doc);
                ReactDOM.unmountComponentAtNode(doc);
            }
            if (result !== undefined) {
                resolve(result);
            } else {
                reject();
            }
        };
        if(controller) {
            controller.onClose = onClose;
        }
        const componentWithProps = React.createElement(Component, { onClose,...data });
        ReactDOM.render(componentWithProps, container);
    });
};