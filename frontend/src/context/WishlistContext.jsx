import { createContext,useContext,useEffect,useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider =({children}) => {
const [wish,setWish] = useState([]);
    const handleWish = (gameId) => {
        setWish(preWish=>{
        if(preWish.includes(gameId)){
        return preWish.filter(id => id !== gameId);
    }
    return [...preWish,gameId];

});
};

return (
    <WishlistContext.Provider value ={{wish, handleWish}}>
    {children}
    </WishlistContext.Provider>
);
};

export const useWish = () => useContext(WishlistContext)