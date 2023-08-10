import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


const RoleItems = (props) => {
    // const [productDetailsShow, setProductDetailsShow] = React.useState(false);
    // const [selectedProduct, setSelectedProduct] = React.useState({});
    // let quotePageLink = null;
    // const showQuoteForm = (selectedProductId) => {
    //     quotePageLink.click();
    //     props.updateProductSelection(props.selectedCategory, selectedProductId);
    // }

    if (props.productItems && props.productItems.length > 0) {
        return (
            <div>

             
            </div>
        );
    }
    else {
        return <div></div>
    }

}

export default RoleItems;