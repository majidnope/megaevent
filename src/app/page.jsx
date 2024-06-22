"use client"
import { Alert, Button, Input, Modal, SimpleGrid } from "@mantine/core";
import { useState } from "react";
import Image from "next/image";
import sx from "./page.module.scss"
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconCurrencyRupee } from '@tabler/icons-react';
import Script from "next/script";
import { useRouter } from "next/navigation";


export default function Home() {
  const nav = useRouter()
  const [type, setType] = useState({ gold: 199, premium: 499 })
  const [opened, { open, close }] = useDisclosure(false);
  const [ticket, setTicket] = useState()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState(0)
  const [seats, setSeats] = useState(1)


  const [error, setError] = useState({
    name: "",
    phone: "",
    seats: "",


  })


  const createOrderId = async () => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(ticket * Number(seats)) * 100,
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  };
  const processPayment = async (e) => {
    if (!ticket) return Alert("Select a ticket")
    e.preventDefault();
    if (!name) {
      return setError(prev => ({ ...prev, name: "Please enter your name" }))

    }

    if (!email || email.length != 10) {
      return setError(prev => ({ ...prev, phone: email.length != 10 ? "Provide a valid phone number" : "Please enter your phone number" }))

    }
    try {
      const orderId = await createOrderId();
      const options = {
        key: "rzp_test_eqV8dCfHg4PKeK",
        amount: parseFloat(ticket * Number(seats)) * 100,
        currency: 'INR',
        name: 'Mega Event',
        description: 'description',
        order_id: orderId,
        handler: async function (response) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch('/api/verify', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          });

          const res = await result.json();
          console.log(res);
          close()
          if (res.isOk) {
            nav.push(`/${res.id.split('pay_')[1]}`)
          }
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: name,
          contact: email,
        },
        theme: {
          color: '#3399cc',
        },
      };
      console.log("tes");
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };






  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Modal opened={opened} onClose={close} title="Ticket Booking" centered styles={{
        body: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      }}>
        <form
          className={sx.form}
          onSubmit={processPayment}
        >

          <Input.Wrapper label="Name" error={error.name}>
            <Input
              type="text"
              placeholder="Full name"
              required
              variant="filled" size="md"
              value={name}
              onChange={(e) => {
                setError(prev => ({ ...prev, name: "" }))
                setName(e.target.value)
              }}
            />
          </Input.Wrapper>


          <Input.Wrapper label="Phone Number" error={error.phone}>
            <Input
              type="number"
              placeholder="Enter your phone number"
              required
              variant="filled" size="md"
              value={email}
              onChange={(e) => {
                setError(prev => ({ ...prev, phone: "" }))
                setEmail(e.target.value)
              }}
            />
          </Input.Wrapper>


          <Input.Wrapper label="Seats (Ages 5 and Above)" description="Select Your Seats for Ages 5 and Above" >
            <Input
              component="select"
              pointer
              rightSection={<IconChevronDown size={14} stroke={1.5} />}
              required
              variant="filled" size="md"
              value={seats}

              onChange={(e) => {
                setSeats(e.target.value)
              }}
            >
              <option value="1">1 Seat</option>
              <option value="2">2 Seats</option>
              <option value="3">3 Seats</option>
              <option value="4">4 Seats</option>
              <option value="5">5 Seats</option>
              <option value="6">6 Seats</option>
              <option value="7">7 Seats</option>
              <option value="8">8 Seats</option>
              <option value="9">9 Seats</option>
              <option value="10">10 Seats</option>
              <option value="11">11 Seats</option>
              <option value="12">12 Seats</option>
              <option value="13">13 Seats</option>
              <option value="14">14 Seats</option>
              <option value="15">15 Seats</option>
              <option value="16">16 Seats</option>
              <option value="17">17 Seats</option>
              <option value="18">18 Seats</option>
              <option value="19">19 Seats</option>
              <option value="20">20 Seats</option>
              <option value="21">21 Seats</option>
              <option value="22">22 Seats</option>
              <option value="23">23 Seats</option>
              <option value="24">24 Seats</option>
              <option value="25">25 Seats</option>
              <option value="26">26 Seats</option>
              <option value="27">27 Seats</option>
              <option value="28">28 Seats</option>
              <option value="29">29 Seats</option>
              <option value="30">30 Seats</option>
              <option value="31">31 Seats</option>
              <option value="32">32 Seats</option>
              <option value="33">33 Seats</option>
              <option value="34">34 Seats</option>
              <option value="35">35 Seats</option>
              <option value="36">36 Seats</option>
              <option value="37">37 Seats</option>
              <option value="38">38 Seats</option>
              <option value="39">39 Seats</option>
              <option value="40">40 Seats</option>

            </Input>
          </Input.Wrapper>




          <SimpleGrid>
            <span style={{ color: "#007700" }}>Payable <IconCurrencyRupee size={14} /> {ticket * Number(seats)}</span>
            <Button type="submit">Book My Ticket</Button>
            <span style={{
              color: "red",
              fontSize: "x-small",
              textAlign: "center"
            }}>No refund after booking the ticket</span>
          </SimpleGrid>
        </form>
      </Modal>
      <main className={sx.main}>
        <div className={sx.banner}>

        </div>

        <div className={sx.block}>
          <span>Available Tickets</span>
          <SimpleGrid cols={{ sm: 1, lg: 3 }} spacing="xl" >
            <div className={sx.ticket}>
              <Image src="/tic.jpeg" fill object-fit="cover" />
              <Button className={sx.btn} onClick={() => {
                open()
                setTicket(type.gold)
              }}>
                Book this ticket

              </Button>
            </div>

            <div className={sx.ticket}>
              <Image src="/tic1.jpeg" fill object-fit="cover" />
              <Button className={sx.btn} onClick={() => {
                open()
                setTicket(type.premium)
              }}>
                Book this ticket
              </Button>
            </div>

          </SimpleGrid>
        </div>


      </main>
    </>
  );
};

