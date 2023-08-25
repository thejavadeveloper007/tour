
const Tours = (props) =>{
    const { id, name, imageCover, price, ratingAvg, ratingQty, cityName } = props.tourData;
    return(
       <>
         <div className="flex flex-col grow border border-gray-500 rounded-md p-1 h-full shadow-md">
                <img className="w-96 rounded-md" src={imageCover} alt="tour_image" />
                {/* <h1>{id}</h1> */}
                <span className="font-bold">{name}</span>
                <span className="italic">city: {cityName}</span>
                <span>⭐{ratingAvg}</span>
                <span>ratings: {ratingQty}</span>
                <span>₹ {price}</span>
            </div>
       </>
    )
}

export default Tours;