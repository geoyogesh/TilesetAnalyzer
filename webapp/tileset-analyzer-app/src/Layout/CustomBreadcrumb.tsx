import { Breadcrumb } from "antd";
import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CustomBreadcrumb: FC = () => {
    const location = useLocation();
    const [active, setActive] = useState<string | null>(null);


    useEffect(() => {
        const getCurrentComponent = () => {
            try {
                const urlParts = location.pathname.split('/');
                let urlPart = urlParts[urlParts.length - 1];
                if (urlPart !== '') {
                    const parts = urlPart.split('-');
                    let result = '';
                    for (const part of parts) {
                        result += part.charAt(0).toUpperCase() + part.slice(1) + ' ';
                    }
                    setActive(result);
                }
            } catch (error) {
    
            }
    
        }

        getCurrentComponent();
    }, [location.pathname])
    

    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {active && <Breadcrumb.Item>{active}</Breadcrumb.Item>}
        </Breadcrumb>
    )
}

export default CustomBreadcrumb;