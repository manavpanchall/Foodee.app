import React, { useRef, useState, useEffect } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
    const menuContainerRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    // Split menu items into two rows
    const menuItemsPerRow = Math.ceil(menu_list.length / 2);
    const row1Items = menu_list.slice(0, menuItemsPerRow);
    const row2Items = menu_list.slice(menuItemsPerRow);

    const scrollMenu = (direction) => {
        if (menuContainerRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 200 : 300;
            menuContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Check if scrolling is needed
    useEffect(() => {
        const checkScroll = () => {
            if (menuContainerRef.current) {
                const { scrollWidth, clientWidth } = menuContainerRef.current;
                setShowArrows(scrollWidth > clientWidth);
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore our menu</h1>
            <p className='explore-menu-text'>
                Explore a diverse menu filled with delectable dishes crafted to satisfy every craving. 
                Our mission is to delight your taste buds and elevate your dining experience, one delicious meal at a time.
            </p>
            
            <div className="explore-menu-list">
                <div className="menu-container" ref={menuContainerRef}>
                    <div className="menu-rows-wrapper">
                        {/* First Row */}
                        <div className="menu-row">
                            <div 
                                onClick={() => setCategory("All")} 
                                className={`explore-menu-list-item ${category === "All" ? "active" : ""}`}
                            >
                                <img src={menu_list[0].menu_image} alt="All categories" />
                                <p>All</p>
                            </div>
                            {row1Items.map((item,index)=>{
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

                        {/* Second Row */}
                        <div className="menu-row">
                            {row2Items.map((item,index)=>{
                                return (
                                    <div 
                                        onClick={() => setCategory(item.menu_name)} 
                                        key={index + row1Items.length} 
                                        className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
                                    >
                                        <img src={item.menu_image} alt={item.menu_name}/>
                                        <p>{item.menu_name}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows - Only show if scrolling is needed */}
                {showArrows && (
                    <div className="menu-navigation">
                        <button 
                            className="nav-arrow left"
                            onClick={() => scrollMenu('left')}
                            aria-label="Scroll left"
                        >
                            ‹
                        </button>
                        <button 
                            className="nav-arrow right"
                            onClick={() => scrollMenu('right')}
                            aria-label="Scroll right"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
            <hr/>
        </div>
    )
}

export default ExploreMenu