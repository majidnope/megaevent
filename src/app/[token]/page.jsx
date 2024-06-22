"use client"
import React from 'react';
import sx from "./page.module.scss";
import { useParams } from 'next/navigation';
import { Button, Loader } from '@mantine/core';
import html2canvas from "html2canvas";
import Ticket from './Ticket';
import { useEffect } from 'react';
import { useScreenshot } from 'use-react-screenshot';

const Page = () => {
    const ToCaptureRef = React.useRef();


    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ToCaptureRef.current)
    useEffect(() => {
        console.log(image);
    }, [image])

    function captureScreenshot() {
        // Ensure styles are fully applied by forcing reflow
        const element = ToCaptureRef.current;
        if (element) {
            element.style.display = 'none';
            element.offsetHeight; // trigger reflow
            element.style.display = '';
        }

        // Add a delay to ensure rendering is complete
        setTimeout(() => {
            html2canvas(ToCaptureRef.current, { useCORS: true })
                .then((canvas) => {
                    console.log(canvas);
                    var dataURL = canvas.toDataURL("image/png");
                    var img = new Image();
                    img.src = dataURL;
                    img.download = dataURL;
                    var a = document.createElement("a");
                    a.innerHTML = "DOWNLOAD";
                    a.target = "_blank";
                    a.href = img.src;
                    a.download = img.download;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                });
        }, 100); // Adjust delay as needed
    }

    const { token } = useParams();
    const [loading, setLoading] = React.useState(true);
    const [payment, setPayment] = React.useState({});

    React.useEffect(() => {
        console.log(token);
        setLoading(true);
        if (token) {
            fetch("/api/pay", {
                method: "POST",
                body: JSON.stringify({ paymentId: `pay_${token}` }),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => {
                res.json().then(data => {
                    console.log(data);
                    setPayment(data.payment);
                    setLoading(false);
                });
            });
        }
    }, [token]);

    return (
        <div className={sx.container}>
            {loading ? <Loader color="blue" type="bars" styles={{
                root: {
                    position: "absolute",
                    top: "50%"

                }
            }} /> :
                <>
                    <Ticket ref={ToCaptureRef} payment={payment} />
                    <Button onClick={captureScreenshot}>Download Ticket</Button>
                </>
            }
        </div>
    );
}

export default Page;
