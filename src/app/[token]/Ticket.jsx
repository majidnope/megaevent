"use client";
import React from 'react';
import sx from "./page.module.scss";
import ImageN from 'next/image';
import QRCode from 'react-qr-code';
import { IconCurrencyRupee } from '@tabler/icons-react';

const Ticket = React.forwardRef(({ payment }, ref) => {
    return (
        <div className={sx.holder} ref={ref}>
            <div className={sx.qr}>
                <div className={sx.ticket}>
                    <ImageN src="/tic.jpeg" fill objectFit="cover" />
                </div>
            </div>
            <div className={sx.info}>
                <div className={sx.details}>
                    <div>
                        <span>Sat, 29 Jun '23 <br /> <span>06:00 PM</span></span>
                        <QRCode
                            className={sx.btn}
                            size={156}
                            style={{
                                zIndex: 3,
                                width: "70px",
                                height: "70px"
                            }}
                            value={payment?.id}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <div>
                        <span>Ticket&nbsp;Type <br /> <span>{payment?.amount / 100 % 499 ? " Gold Circle" : " Premium Circle"}</span></span>
                        <span>Amount&nbsp;Payed <br /><span><IconCurrencyRupee size={18} />{payment?.amount / 100}</span></span>
                    </div>
                    <span>No. of seats <br /><span>{payment?.amount / 100 % 499 ? (payment?.amount / 100) / 199 : (payment?.amount / 100) / 499}</span></span>
                    <span>Phone Number <br /><span>{payment?.contact}</span></span>
                </div>
            </div>
        </div>
    );
});

export default Ticket;
