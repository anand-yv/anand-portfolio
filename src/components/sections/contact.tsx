import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Reveal } from "@/components/motion/reveal";
import { Postcard } from "@/components/sections/postcard";
import { SectionHeader } from "@/components/sections/section-header";

export function Contact() {
  return (
    <SectionWrapper id="contact" width="wide">
      <Reveal>
        <SectionHeader
          index="05"
          label="contact"
          title="Get in touch"
          description="Drop me a line. It lands in my inbox like a postcard."
        />
      </Reveal>
      <div className="mt-10">
        <Postcard />
      </div>
    </SectionWrapper>
  );
}
