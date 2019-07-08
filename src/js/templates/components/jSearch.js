import React, { Component } from 'react';

/* Images */
import logoB from '../../../assets/imgs/logo/Logo1_b.png';
import logoW from '../../../assets/imgs/logo/Logo1_w.png';

import masks from '../../../assets/imgs/icons/theater-masks-solid.svg';
import markMasks from '../../../assets/imgs/icons/mask-solid.svg';
import edgeLine from '../../../assets/imgs/icons/draw-polygon-solid.svg';
/* Components */

class JSearch extends Component{
    constructor(props) {
        super(props);

        this.state = {
            components: [
                {"title":"tmp1", "icon":masks},
                {"title":"tmp1", "icon":markMasks},
                {"title":"tmp1", "icon":edgeLine}
            ]
        }
    }      

    render(){        
        return(
            <div className="jada-body-container">
                <div className={"jada-search-container " + this.props.character}>
                    <div className="jsearch-components">
                        <div className="jsearch-btn"><img src={logoW} /></div>

                        {this.state.components.map((item,i) => 
                            <div className="jsearch-btn" key={i}><img src={item.icon} /></div>
                        )}
                    </div>
                </div>
            </div>
        );        
    }
}

export default JSearch;