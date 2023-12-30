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

11. pull to refresh feed

12. useLocation (and update posts accordingly). maybe use a map from post _id instead of storing proximityKm in the postData
