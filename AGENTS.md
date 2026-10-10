<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the map at its own `/kartta` route with shared typed location data and a separate map component, so filters and details use the same source.
- Import Leaflet dynamically inside a browser effect, because its module requires browser globals and cannot execute during SSR.
- Label unverified mobility and service points as examples; never imply live availability without a connected source.
