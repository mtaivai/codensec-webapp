import React from 'react';

import './ContainerPlaceholder.css';


const ContainerPlaceholder = ({children}) => {
    return (
        <div className={"ContainerPlaceholder"}>
            <div className={"ContainerPlaceholder-Inner"}>
                <div className={"ContainerPlaceholder-Content"}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ContainerPlaceholder;