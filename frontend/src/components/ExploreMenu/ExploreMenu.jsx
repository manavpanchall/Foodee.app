import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Explore a diverse menu filled with delectable dishes crafted to satisfy every craving. Our mission is to delight your taste buds and elevate your dining experience, one delicious meal at a time.  </p>
        <div className="explore-menu-list">
            <div 
              onClick={() => setCategory("All")} 
              className={`explore-menu-list-item ${category === "All" ? "active" : ""}`}
            >
              <img src={menu_list[0].menu_image} alt="All" />
              <p>All</p>
            </div>
            {menu_list.map((item,index)=>{
                return (
                    <div 
                      onClick={() => setCategory(item.menu_name)} 
                      key={index} 
                      className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
                    >
                        <img src={item.menu_image} alt={item.menu_name}/>
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr/>
    </div>
  )
}

export default ExploreMenu