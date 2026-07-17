import React from "react";
import { useLocation } from "react-router-dom";
import { serverURL } from "../../../services/serverURL";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import toast, { Toaster } from 'react-hot-toast'
function ProposalSuccess() {
    const location = useLocation()
    const { proposal, decision, signature } = location.state || {}

    const timestamp = signature?.signed_at
        ? new Date(signature.signedAt).toLocaleString()
        : new Date().toLocaleString()

    const generatePDF = async () => {
        try{
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([595, 842])
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        page.drawText('Proposal Signature Certificate', {
            x: 50, y: 780, size: 20, font: boldFont, color: rgb(0, 0, 0)
        })
        page.drawLine({
            start: { x: 50, y: 765 }, end: { x: 545, y: 765 },
            thickness: 1, color: rgb(0.8, 0.8, 0.8)
        })

        const details = [
            { label: 'Proposal', value: proposal?.project_name },
            { label: 'Client Name', value: signature?.client_name },
            { label: 'Client Email', value: signature?.client_email },
            { label: 'Decision', value: decision },
            { label: 'IP Address', value: signature?.ip_address },
            { label: 'Timestamp', value: timestamp },
        ]

        let y = 730
        details.forEach(({ label, value }) => {
            page.drawText(`${label}:`, {
                x: 50, y, size: 12, font: boldFont, color: rgb(0.4, 0.4, 0.4)
            })
            page.drawText(value || '-', {
                x: 200, y, size: 12, font, color: rgb(0, 0, 0)
            })
            y -= 30
        })
if (decision === 'Accepted' && signature?.signature_image_url) {
    try {
        const imgUrl = signature.signature_image_url
        const imgBytes = await fetch(imgUrl).then(r => r.arrayBuffer())
        
        let img
        const isPNG = signature.signature_image_url.toLowerCase().endsWith('.png')
        if (isPNG) {
            img = await pdfDoc.embedPng(imgBytes)
        } else {
            img = await pdfDoc.embedJpg(imgBytes)
        }
        
        page.drawText('Signature:', {
            x: 50, y, size: 12, font: boldFont, color: rgb(0.4, 0.4, 0.4)
        })
        y -= 20
        page.drawImage(img, { x: 50, y: y - 80, width: 200, height: 80 })
    } catch (e) {
        console.log('signature image not loaded', e)
    }
}


        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `proposal_${signature?.client_name}_${decision}.pdf`
        link.click()
         toast.success('Downloaded')
    }catch(err){
           console.log('PDF generation failed', err)
        toast.error('Failed to generate PDF certificate')
    }
}

    return (
        <div
            className="min-h-screen font-['DM_Sans',sans-serif]"
            style={{ background: "url('/Images/background_img.svg') #f9fafc center / cover no-repeat fixed" }}
        >
            <Toaster position="top-center" />

            <header className="flex items-center justify-between w-full shrink-0 px-[164px] py-[26px] max-[1639px]:px-12 max-[1200px]:px-10 max-[640px]:px-5 max-[640px]:flex-col max-[640px]:gap-5">
                <a href="#" aria-label="ProposalHub home">
                    <img src="/icons/logo.svg" alt="ProposalHub" className="h-11 w-auto" />
                </a>
                <nav className="flex items-center gap-4" aria-label="Social media links">
                    <a href="https://www.facebook.com/mindbeesteam/" aria-label="Facebook">
                        <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5 hover:opacity-70" />
                    </a>
                    <a href="https://www.instagram.com/mindbeesdigital" aria-label="Instagram">
                        <img src="/icons/instagram.svg" alt="Instagram" className="w-5 h-5 hover:opacity-70" />
                    </a>
                    <a href="https://x.com/MindbeesDigital" aria-label="Twitter">
                        <img src="/icons/twitter.svg" alt="Twitter" className="w-5 h-5 hover:opacity-70" />
                    </a>
                    <a href="https://www.linkedin.com/company/mindbees" aria-label="LinkedIn">
                        <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5 hover:opacity-70" />
                    </a>
                    <a href="https://in.pinterest.com/mindbeesdigital/" aria-label="Pinterest">
                        <img src="/icons/pinterest.svg" alt="Pinterest" className="w-5 h-5 hover:opacity-70" />
                    </a>
                </nav>
            </header>

            <div className="flex items-center justify-center py-16 px-4">
                <div className="bg-white rounded-[14px] shadow-[0_8px_40px_rgba(9,8,20,0.06)] p-8 w-full max-w-md text-center">

                    <div className={`${decision === 'Rejected' ? 'bg-red-100' : 'bg-green-100'} rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            {decision === 'Rejected' ? (
                                <path d="M6 18L18 6M6 6l12 12" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
                            ) : (
                                <path d="M5 13l4 4L19 7" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-[#1e1e21] mb-1">Proposal {decision}!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Your response has been recorded. The sender has been notified.
                    </p>

                    <div className="bg-[#f7f7fb] rounded p-4 text-left space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Proposal</span>
                            <span className="font-medium">{proposal?.project_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Client</span>
                            <span className="font-medium">{signature?.client_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{signature?.client_email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className={`${decision === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-xs font-medium px-3 py-1 rounded-full`}>
                                {decision}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Timestamp</span>
                            <span className="font-medium">{timestamp}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-xs mt-5">
                        You may close this page. Your response has been recorded.
                    </p>
                    <button
                        onClick={generatePDF}
                        className="mt-5 w-full text-white py-2 rounded-[3px] font-bold cursor-pointer text-sm transition-colors bg-[#576aff] hover:bg-[#3d52f2] active:scale-[0.995]"
                    >
                        Download PDF Certificate
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ProposalSuccess;