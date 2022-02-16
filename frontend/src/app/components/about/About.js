import React, { useEffect, useState } from 'react'
import profileImage from "../../../images/aboutDev.jpg"
import developerSum from "./developerSum.txt"
import whyFin from "./whyFin.json"
import github  from "../../../images/icons/Github.svg"
import linkedIn from "../../../images/icons/LinkedIn.svg"
const About = () =>{
    const [summaryText, setSummary] = useState("")
    useEffect(() => {
        const readSummary = async() => {
            fetch(developerSum)
            .then((r) => r.text())
            .then(text  => {
                setSummary(text)
                return text
            })
        } 
        readSummary()  
    }, [])

    return(
        <div className='about-bg-container'>
            <div className='about-pg-content'>
                <div className='about-pg-profile-image'>
                    <img
                        src={profileImage}
                        alt = {"Arky in Wall St, sitting on a bull"}
                    />
                </div>
                <div className='about-pg-developer-summary-card'>
                    <h2>The Developer</h2>
                    <p>
                        {summaryText}
                    </p>
                    <div className='about-pg-social-media'>
                        <a
                            href="https://github.com/aasmal97"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                             <img src = {github}/>

                        </a>  
                        <a
                            href="https://www.linkedin.com/in/arky-asmal"                            
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src= {linkedIn}/>
                        </a>

                    </div>
                </div>
                
            </div>
            <div className='about-pg-why-fintrack'>
                <h2>Why build FinTrack?</h2>
                <p className="why-fintrack-intro"><span>{whyFin.intro[0]}</span>
                    {whyFin.intro.substring(1)}
                </p>
                <ol>
                    {whyFin.lists.list1.map((item, index) =>{
                        const mainPointRegex = /[A-Za-z -]*[.]/
                        const mainPoint = item.match(mainPointRegex)[0]
                        const pointLength = mainPoint.length
                        return(
                        <li
                            key = {index}
                        >
                                <div className='marker'>{(index + 1) + "."}</div>
                                <span>{mainPoint}</span>
                                {item.substring(pointLength)}
                           
                        </li>
                        )
                    })}
                </ol>
                <p className='why-build-fintrack'>
                    <span>So why build this app?</span>
                    <span>The reasons are simple.</span>
                </p>
                <ol>
                    {whyFin.lists.list2.map((item, index)=>{
                        const mainPointRegex = /[A-Za-z -]*[.]/
                        const mainPoint = item.match(mainPointRegex)[0]
                        const pointLength = mainPoint.length
                        return(
                            <li
                                key={index}
                            >
                                <div className='marker'>{(index + 1) + "."}</div>
                                <span>{mainPoint}</span>
                                {item.substring(pointLength)}
                            </li>
                        )
                    })}
                </ol>
            </div>
                <div
                    className='about-pg-contact-me'
                >
                    <p>
                        If you have any suggestions or questions about this app, please contact me at
                        <a
                            href="mailto:arkyasmal@gmail.com"
                            rel="noopener noreferrer"
                        >
                            arkyasmal@gmail.com
                        </a>
                    </p>
                    
                </div>
        </div>
    )
}
export default About