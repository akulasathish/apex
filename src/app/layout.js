import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ApexTech Software Institute | Leading IT Training Institute",
  description: "Accelerate your IT career with industry-focused training at ApexTech Software Institute, Kondapur, Hyderabad. Master AWS, DevOps, Full Stack Web Development, Data Science, Python, Cyber Security, and Software Testing (QA) with hands-on labs and placement support.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 text-gray-800">
        {/* Hidden static form for Netlify Form detection */}
        <form name="contact" action="/__forms.html" data-netlify="true" hidden>
          <input type="hidden" name="form-name" value="contact" />
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="tel" name="phone" />
          <input type="text" name="course" />
          <textarea name="message"></textarea>
        </form>
        {children}
      </body>
    </html>
  );
}
