import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { participants, Participant } from '@/config/participants';
import { Check, Info, User, Trophy, Flame } from 'lucide-react';

type Step = 'welcome' | 'rules' | 'identity' | 'voting' | 'success' | 'already_voted';

export function SurvivorVoting() {
    const [step, setStep] = useState<Step>('welcome');
    const [identity, setIdentity] = useState<Participant | null>(null);
    const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hasVoted = localStorage.getItem('survivor_voted');
        if (hasVoted) {
            setStep('already_voted');
        }
    }, []);

    const handleVoteToggle = (participantId: string) => {
        setError(null);
        setSelectedVotes(prev => {
            if (prev.includes(participantId)) {
                return prev.filter(id => id !== participantId);
            }
            if (prev.length < 3) {
                return [...prev, participantId];
            }
            return prev;
        });
    };

    const submitVotes = () => {
        if (selectedVotes.length !== 3) {
            setError("Vous devez voter pour exactement 3 personnes.");
            return;
        }
        localStorage.setItem('survivor_voted', 'true');
        setStep('success');
    };

    const variants = {
        enter: { opacity: 0, x: 20 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const containerStyle = "min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-neutral-100 p-4 md:p-8 flex flex-col items-center justify-center overflow-x-hidden";

    return (
        <div className={containerStyle}>
            <AnimatePresence mode="wait">
                {step === 'already_voted' && (
                    <motion.div
                        key="already_voted"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full max-w-md"
                    >
                        <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm">
                            <CardHeader className="text-center">
                                <Flame className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                                <CardTitle className="text-2xl font-black tracking-tighter text-orange-600 uppercase">Le flambeau est éteint</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-neutral-400">Votre vote a déjà été enregistré. La tribu a parlé.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 'welcome' && (
                    <motion.div
                        key="welcome"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="text-center space-y-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative"
                        >
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
                                THE <span className="text-orange-600">SURVIVORS</span>
                            </h1>
                            <p className="text-xl md:text-2xl font-bold tracking-[0.3em] text-neutral-500 mt-2 uppercase">Bienvenue cher survivor</p>
                        </motion.div>
                        <Button 
                            onClick={() => setStep('rules')} 
                            size="lg" 
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-8 px-12 text-xl rounded-none border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            ENTRER DANS L'ARÈNE
                        </Button>
                    </motion.div>
                )}

                {step === 'rules' && (
                    <motion.div
                        key="rules"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full max-w-xl"
                    >
                        <Card className="bg-neutral-900/80 border-neutral-800 backdrop-blur-md">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-5 h-5 text-orange-600" />
                                    <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">Instructions du Conseil</span>
                                </div>
                                <CardTitle className="text-3xl font-black uppercase text-white">Les Lois de la Tribu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-neutral-300">
                                <div className="grid gap-4">
                                    {[
                                        "Vous disposez de 3 votes obligatoires.",
                                        "Il est strictement interdit de voter pour soi-même.",
                                        "Une fois le bulletin glissé dans l'urne, aucun retour n'est possible.",
                                        "Le secret du vote est la pierre angulaire de votre survie."
                                    ].map((rule, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-1">
                                                {i + 1}
                                            </div>
                                            <p className="text-lg">{rule}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => setStep('identity')} className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-6 text-lg rounded-none">
                                    D'ACCORD
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 'identity' && (
                    <motion.div
                        key="identity"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full max-w-md"
                    >
                        <Card className="bg-neutral-900/80 border-neutral-800 backdrop-blur-md">
                            <CardHeader>
                                <CardTitle className="text-2xl font-black uppercase text-white flex items-center gap-2">
                                    <User className="text-orange-600" />
                                    Identifiez-vous
                                </CardTitle>
                                <CardDescription className="text-neutral-400">Sélectionnez votre nom dans la liste des survivants.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select onValueChange={(val) => setIdentity(participants.find(p => p.id === val) || null)}>
                                    <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 h-14 text-lg">
                                        <SelectValue placeholder="Votre nom" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-neutral-800">
                                        {participants.map(p => (
                                            <SelectItem key={p.id} value={p.id} className="focus:bg-orange-600 focus:text-white">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={p.photoUrl} alt={p.name} />
                                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    {p.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => setStep('voting')} disabled={!identity} className="w-full bg-orange-600 text-white hover:bg-orange-700 font-bold py-6 text-lg rounded-none disabled:opacity-50">
                                    ACCÉDER À L'URNE
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {step === 'voting' && (
                    <motion.div
                        key="voting"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full max-w-4xl"
                    >
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-4xl font-black uppercase text-white leading-none">CONSEIL DE VOTE</h2>
                                <p className="text-neutral-400 mt-2">Survivor: <span className="text-orange-600 font-bold">{identity?.name}</span></p>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-none flex items-center gap-4">
                                <span className="text-neutral-500 uppercase text-xs font-bold tracking-widest">Votes restants</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${i <= (3 - selectedVotes.length) ? 'bg-orange-600' : 'bg-neutral-800'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                            {participants.filter(p => p.id !== identity?.id).map(p => {
                                const isSelected = selectedVotes.includes(p.id);
                                return (
                                    <motion.div
                                        key={p.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleVoteToggle(p.id)}
                                        className={`relative cursor-pointer group transition-all duration-300 ${isSelected ? 'ring-4 ring-orange-600' : 'grayscale hover:grayscale-0'}`}
                                    >
                                        <div className="aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800">
                                            <img 
                                                src={p.photoUrl} 
                                                alt={p.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                                                    <div className="bg-orange-600 text-white p-2 rounded-full shadow-xl">
                                                        <Check className="w-8 h-8 font-black" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                                <p className="text-white font-black uppercase tracking-tighter text-sm md:text-base leading-none">{p.name}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-4">
                            {error && (
                                <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
                                    <AlertTitle>Attention</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button 
                                onClick={submitVotes} 
                                disabled={selectedVotes.length !== 3} 
                                className="w-full bg-orange-600 text-white hover:bg-orange-700 font-black py-8 text-2xl rounded-none uppercase tracking-widest shadow-2xl disabled:opacity-30 transition-all"
                            >
                                SCELLER MON VOTE
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full max-w-md text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-600/20"
                        >
                            <Trophy className="w-12 h-12 text-white" />
                        </motion.div>
                        <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Vote enregistré !</h2>
                        <p className="text-neutral-400 text-lg">Votre sentence est irrévocable. Bonne chance pour la suite de l'aventure.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
