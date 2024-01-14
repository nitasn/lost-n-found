1. restrict google maps-api-key to my domain only

3. in the map, on location-icon click, if no locationPermissions, alert.
   also, does the useEffect handle the case when no perm?
4. map on web has many issues: pin animation state, map's not moving, doesn't goto current location on load

5. on search, if there are no items, even if a filter is applied, 
   it should say `there are no items </3`

6. the picUrls of a post should have 2 versions (high & low quality)
   low for FeedPost, high for PostPage

7. the way auth is being exported is inconsistent. use getAuth everywhere...?

9. when an upload fails, show the error message. it could be helpful (image too big, no internet, etc)

10. unite lost and found feeds? if so, add 'type' option to the filter
11. add checkbox "show posts with unspecified location"

12. unite PostPage and FeedPost somehow

13. "oopsie couldn't get user location" there seems to be a problem with the new implementation of location.js
     oopsie couldn't get user location [TypeError: Cannot read property 'animateToRegion' of null]
     also it took way to long for the location to to appear (btn ↗️ had no effect)

14. in post composer, maybe set the location-input's placeholder to reverse-geocode of user location

---

17. don't prompt location until LocationChoser is wanted
18. LocationChoser is broken on web. has NaNs. keyboard doesn't launch

19. make the upload menu items disabled (gray) with msg "To Upload, please Sign In".

19. firebase permissions!
---

20. create watchRenders function!

21. IMPORTANT
add beutiful transitions between screens:
swfits for tabs and shared object for stack

22. submit my app for google review so that users can log in