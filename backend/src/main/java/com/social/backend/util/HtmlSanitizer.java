package com.social.backend.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizer {

    public String sanitize(String html) {
        // Allow basic structural tags and inline CSS
        Safelist safelist = Safelist.relaxed()
                .addAttributes(":all", "style")
                .addAttributes(":all", "class");
        return Jsoup.clean(html, safelist);
    }
}
