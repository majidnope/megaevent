"use client"
import React from 'react'
import sx from "./page.module.scss"
import Image from 'next/image'
import { useParams } from 'next/navigation'
import QRCode from 'react-qr-code'
import { Button, Loader } from '@mantine/core'

const Page = () => {
    const { token } = useParams()
    const [loading, setLoading] = React.useState(true);
    const [payment, setPayment] = React.useState({})

    React.useEffect(() => {
        console.log(token);
        setLoading(true)
        if (token) {
            fetch("/api/pay", { method: "POST", body: JSON.stringify({ paymentId: `pay_${token}` }), headers: { 'Content-Type': 'application/json' }, }).then(res => {
                res.json().then(data => {
                    console.log(data);
                    setPayment(data.payment)
                    setLoading(false);
                })
            })
        }
    }, [token])
    return (
        <div className={sx.container}>

            {loading ? <Loader color="blue" type="bars" /> : <div className={sx.holder}>
                <div className={sx.info}>
                    <span>Phone Number: <span>{payment?.contact}</span></span>
                    <span>Amount Payed: <span>{payment?.amount / 100}</span></span>
                    <span>Ticket Type: <span>{payment?.amount / 100 % 499 ? "Gold Circle" : "Premium Circle"}</span></span>
                </div>
                <div className={sx.qr}>
                    <div className={sx.ticket}>
                        <Image src="/tic.jpeg" fill object-fit="cover" />
                        {<QRCode
                            className={sx.btn}
                            size={156}
                            style={{
                                zIndex: 3,
                                position: "absolute",
                                height: "auto",
                                top: "11%",
                                right: "16%",
                                width: " 44px"
                            }}
                            value={payment?.id}
                            viewBox={`0 0 256 256`}
                        />}
                        {/* <Button className={sx.btn} onClick={() => {
                            open()
                            setTicket(type.gold)
                        }}>
                            Book this ticket

                        </Button> */}
                    </div>

                </div>
            </div>}
        </div>
    )
}

export default Page
