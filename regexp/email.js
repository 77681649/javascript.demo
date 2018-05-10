/**
 * 根据Email内容,生成用于回复的邮件header
 */
const message = `From elvis The Feb 29 11:15 2007
Received: from elvis@localhost by tabloid.org (8.11.3) id KA8CMY
Received: from tabloid.org by gateway.org (8.11.3) id KA8CMY
To: jfriedl@regex.info ( Jeffrey Friedl )
From: elvis@tabloid.org ( The King )
Date: Thu, Feb 29 2007 11:15
Message-Id: <2007022939939.KA8CMY@tabloid.org>
Subject: Be seein' ya around
Reply-To: elvis@hh.tabloid.org
X-Mailer: Madam Zelda's Psychic Orb [ version 3.7 ]

Sorr I haven't been around lately.A few years back I checked into that ole heartbreak hotel in the sky, ifyaknowwhatImean.
The Duke say "hi".
         Elvis
`


/** 
 * header 包含
 * To : <Reply-To>
 * From : <To>
 * Subject: <Subject>
 * 
 * On <Date> <From> wrote :
 * |> ...
 * |> ...
 * |> ...
 */
let receiver = ''

receiver = 'To: ' + message.match(/Reply-To:\s*(.*?)\n/m)[1] + '\n'
receiver += 'From: ' + message.match(/To:\s*(.*?)\n/m)[1] + '\n'

console.log(receiver)