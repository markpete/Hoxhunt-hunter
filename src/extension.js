"use strict";

const hoxhuntTriggers = ["X-Hox", "hoxhunt", "huntsigning", "hox.marker"];
var gSrc = "";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

const IncludesArrayItem = (item) => {
    return(gSrc.indexOf(item) > -1);
}

// actual extension-code
function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        gmail.observe.on("view_email", (domEmail) => {
            console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log("Email data:", emailData);
            const subject = emailData.subject;
            const src_promise = gmail.get.email_source_promise(domEmail);
            src_promise.then((src) => {
                gSrc = src;
                if (hoxhuntTriggers.map(IncludesArrayItem).includes(true)) {
                    console.log("Hoxhunt mail detected");
                    let h2_list = document.getElementsByTagName("h2");
                    [...h2_list].forEach((item) => {
                        if(item.innerText.replace(/\s+/g, '') === subject.replace(/\s+/g, '')) {
                            item.innerText = "🐷🐷🐷WARNING: Hoxhunt mail🐷🐷🐷";
                        }
                    })
                }
            });
        });
    });
}