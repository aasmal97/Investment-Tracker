import { Link } from "react-router-dom"

const MarketingRow = ({
    imgPlacement,
    headingContent,
    subContent,
    linkContent,
    linkHref = "/"
}) =>{
    return(
        <div className="home-pg-marketing-row">
            {imgPlacement === "right" &&
                 <div className="home-pg-marketing-image">
                    <img
                        alt = {"dashboard graph "} 
                    />
                </div>
            }
            <div className="home-pg-marketing-text">
                <div className="inner-container">
                    <h2>{headingContent}</h2>
                    <p>{subContent}</p>
                    <Link
                        to = {linkHref}
                    >
                        <span>{linkContent}</span>
                    </Link>
                </div>
            </div>
            {imgPlacement !== "right" &&
                <div className="home-pg-marketing-image">
                    <img 
                        alt={"dashboard data"}
                    />
                </div>
            }
        </div>
    )
}
const Home = () =>{
    return (
        <main className="home-pg-container">
            <div className="home-pg-intro">
                <div className="home-pg-intro-circle">
                    
                    <h2>Take control of your finances</h2>
                    <p>Over 4 thousand 
                        cryptocurriences and stocks,
                        cataloged for tracking
                    </p>
                    <Link to={"/signup"}>
                        <span>Join for Free</span>
                    </Link>
                </div>
            </div>
            <div className="home-pg-marketing">
                <div className="home-pg-marketing-tracking">
                    <MarketingRow                     
                        headingContent = {"All your investments in one place"}
                        subContent = {
                            "Track crypto like Bitcoin, and Etherum and stocks like Tesla, and Apple without going anywhere else."
                        }
                        linkContent = {"Learn More"}
                        linkHref = {"/learnMore"}
                    />
                </div>
                <div className="home-pg-marketing-progress">
                    <MarketingRow 
                        imgPlacement={"right"}
                        headingContent = {"Keep your investment progress crystal clear"}
                        subContent = {
                            "Get a full view of your top perfoming investments, gains, transactions, and more, all without moving an inch."
                        }
                        linkContent = {"Join for free"}
                        linkHref = {"/signup"}
                    />
                </div>
            </div>
        </main>
    )
}
export default Home