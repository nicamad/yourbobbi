"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MessageCircle,
  FileText,
  Send,
} from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bobbi", text: "Hi, I’m Bobbi 👋 How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [intake, setIntake] = useState({ name: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bobbi", text: "Got it — let me process that for you!" },
      ]);
    }, 600);
  };

  const handleIntakeSubmit = () => {
    if (!intake.name || !intake.email) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full"
      >
        <h1 className="text-4xl font-bold text-center mb-4">
          Meet Bobbi — your back-office, MBA brain.
        </h1>
        <p className="text-center text-gray-600 mb-10">
          AI-powered operations, analysis, and growth strategies for your
          business.
        </p>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Try Bobbi</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Live Chat
                </TabsTrigger>
                <TabsTrigger value="intake" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Intake Form
                </TabsTrigger>
              </TabsList>

              {/* Chat tab */}
              <TabsContent value="chat">
                <div className="h-64 overflow-y-auto border rounded-md p-3 mb-3 bg-gray-50">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex mb-2 ${
                        m.from === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {m.from === "bobbi" && (
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          m.from === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Intake form tab */}
              <TabsContent value="intake">
                {!submitted ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={intake.name}
                      onChange={(e) =>
                        setIntake({ ...intake, name: e.target.value })
                      }
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={intake.email}
                      onChange={(e) =>
                        setIntake({ ...intake, email: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Notes"
                      value={intake.notes}
                      onChange={(e) =>
                        setIntake({ ...intake, notes: e.target.value })
                      }
                    />
                    <Button onClick={handleIntakeSubmit} className="w-full">
                      Submit
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-2">
                      ✅ Thanks {intake.name}, we’ll be in touch!
                    </p>
                    <Progress value={100} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Bobbi. All rights reserved.
        </div>
      </motion.div>

      {/* Floating chat button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6"
      >
        <Button className="rounded-full shadow-xl px-5 py-2">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat with Bobbi
        </Button>
      </motion.div>
    </main>
  );
}

