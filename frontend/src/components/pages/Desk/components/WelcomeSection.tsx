import { useEffect, useState } from "react";

type WelcomeSectionProps = {
  firstName: string;
  lastName: string;
  attendanceStatus?: string;
  checkIn?: string | null;
};

const persianDays = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const getGreeting = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return "صبح بخیر";
  }

  if (hour >= 12 && hour < 17) {
    return "ظهر بخیر";
  }

  if (hour >= 17 && hour < 21) {
    return "عصر بخیر";
  }

  return "شب بخیر";
};

const getWelcomeMessage = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return "امیدوارم روز کاری خوبی داشته باشید.";
  }

  if (hour >= 12 && hour < 17) {
    return "خسته نباشید، ادامه روزتون پرانرژی.";
  }

  if (hour >= 17 && hour < 21) {
    return "روز کاری خوبی رو پشت سر گذاشتید.";
  }

  return "وقت استراحت و تجدید انرژی است.";
};

const getPersianDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(date);
};

const WelcomeSection = ({
  firstName,
  lastName,
  attendanceStatus,
  checkIn,
}: WelcomeSectionProps) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting(now.getHours());
  const message = getWelcomeMessage(now.getHours());

  const time = now.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = getPersianDate(now);

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-card p-6">
      <div className="relative z-10">
        <p className="text-sm text-muted-foreground">{date}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-bold">
            {greeting}، {firstName} {lastName} 👋
          </h1>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-muted px-4 py-2">
            <span className="text-xs text-muted-foreground">ساعت</span>

            <p className="mt-0.5 text-lg font-semibold tabular-nums">{time}</p>
          </div>

          {attendanceStatus && (
            <div className="rounded-xl bg-muted px-4 py-2">
              <span className="text-xs text-muted-foreground">وضعیت امروز</span>

              <p className="mt-0.5 text-sm font-semibold">
                {attendanceStatus}
                {checkIn && ` • ورود ${checkIn}`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
};

export default WelcomeSection;
