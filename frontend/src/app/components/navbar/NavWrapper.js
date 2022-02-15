import Navbar from './Navbar'
import Footer from '../footer/Footer'
import useWindowWidth from '../../hooks/use-window-width';

export default function NavWrapper(props) {
    const windowWidth = useWindowWidth(992)
    return (
        <>
            <Navbar 
                windowWidth = {windowWidth}
            />
                <div style={{paddingTop: "3.7rem"}}>
                    {props.children}
                </div>
            <Footer 
                windowWidth = {windowWidth}
            />
        </>
    )
}
