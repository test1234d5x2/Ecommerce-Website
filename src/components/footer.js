import React from "react";
import { H3Title } from "./titles";

export const Footer = (props) => {
    return (
        <footer>
            <section className="footer-section">
                <H3Title className="footer-section-title" title="Products" />
                <a className="footer-link" href="./products/NEW!">NEW!</a>
                <a className="footer-link" href="./products/Collections">Collections</a>
                <a className="footer-link" href="./products/Shirts">Shirts</a>
                <a className="footer-link" href="./products/Polo Shirts">Polo Shirts</a>
                <a className="footer-link" href="./products/Formal">Formal</a>
            </section>
            <section className="footer-section">
                <H3Title className="footer-section-title" title="Support" />
                <a className="footer-link">Help</a>
                <a className="footer-link">Delivery</a>
                <a className="footer-link">Returns & Refunds</a>
                <a className="footer-link">Exchange Policy</a>
                <a className="footer-link">Student Discount</a>
                <a className="footer-link">Data Settings</a>
                <a className="footer-link">Cookie Settings</a>
                <a className="footer-link">Cookies</a>
                <a className="footer-link">Privacy Policy</a>
                <a className="footer-link">Terms & Conditions</a>
            </section>
            <section className="footer-section">
                <H3Title className="footer-section-title" title="Contact Us" />
                <a className="footer-link" id="phone">Phone: 01234 56789</a>
                <a className="footer-link">Send Email: feedback@outfitsora.com</a>
            </section>
            <section className="footer-section">
                <H3Title className="footer-section-title" title="Socials" />
                <a className="footer-link" href="https://www.facebook.com/" target="_blank"><img className="social-icons icons" src="./images/facebook.png" /></a>
                <a className="footer-link" href="https://www.twitter.com/" target="_blank"><img className="social-icons icons" src="./images/twitter.png" /></a>
                <a className="footer-link" href="https://www.instagram.com/" target="_blank"><img className="social-icons icons" src="./images/instagram.png" /></a>
                <a className="footer-link" href="https://www.tiktok.com/" target="_blank"><img className="social-icons icons" src="./images/tiktok.png" /></a>
                <a className="footer-link" href="https://www.youtube.com/" target="_blank"><img className="social-icons icons" src="./images/youtube.png" /></a>
            </section>
        </footer>
    )
}