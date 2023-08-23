import Tours from "./Tours"
import useTours from "../utils/useTour";
import Simmer from "./Simmer";
// import store from "../utils/store";
// import { useSelector } from "react-redux";


const Body = () =>{
    const { tours } = useTours();
  // const token = useSelector(store => store.tour?.token);
  // const token = document.cookie.split('_secure_ARJ_=')[1];

  // console.log('token 13',token);
    console.log('tour',tours);
    console.log('tour length',tours.length);

    return tours?.length === 0 ? <Simmer /> : (
       <>
      <div className="grid grid-cols-5 gap-2 m-2 items-stretch">
         {
            tours?.map( ele => 
               <div key={ele.id}>
                 <Tours tourData={ele}/>
               </div>
                )
           }
         </div>
       </>
    )
}

export default Body